import re
import json
from PIL import Image
import google.generativeai as genai
from typing import Union
from .config import model  # Import model from config

def analyze_food_image(image: Image.Image) -> dict:
    """
    Main function to analyze any food image (with or without label)
    """
    try:
        # Ensure image is in RGB mode
        if image.mode not in ('RGB', 'L'):
            image = image.convert('RGB')

        # First, determine if the image contains a product label
        try:
            has_label = detect_product_label(image)
        except Exception as e:
            return {"error": f"Error detecting label type: {str(e)}"}

        try:
            if has_label:
                return analyze_product_label(image)
            else:
                return analyze_raw_food(image)
        except Exception as e:
            return {"error": f"Error during analysis: {str(e)}"}

    except Exception as e:
        return {"error": f"Error processing image: {str(e)}"}

def detect_product_label(image: Image.Image) -> bool:
    """
    Detect if the image contains a product label
    """
    prompt = """
    Analyze this image and determine if it contains a product nutrition label/packaging.
    Respond with only 'true' if it contains a product label, or 'false' if it's a raw/unpackaged food item.
    """

    response = model.generate_content([prompt, image])
    return 'true' in response.text.lower()

def calculate_macro_ratio(nutrition):
    """
    Calculate the ratio of protein to carbohydrates
    """
    try:
        protein = float(nutrition["macronutrients"]["protein"].replace('g', ''))
        carbs = float(nutrition["macronutrients"]["total_carbohydrates"].replace('g', ''))

        if carbs == 0:
            return "N/A"

        ratio = round(protein / carbs, 2)
        return f"{ratio}:1"
    except:
        return "Unable to calculate ratio"


def analyze_product_label(image_path):
    """
    Enhanced analysis for product labels
    """
    prompt = """
    Analyze this product label and provide information in the following JSON format.
    Extract exact values from the nutrition label. Include units (g, mg, mcg) for all measurements.
    {
        "product_info": {
            "product_name": "",
            "brand": "",
            "package_size": ""
        },
        "nutrition_facts": {
            "serving_size": {
                "amount": "",
                "unit": "",
                "servings_per_container": ""
            },
            "calories": "",
            "macronutrients": {
                "total_fat": {
                    "amount": "",
                    "unit": "g",
                    "daily_value": ""
                },
                "saturated_fat": {
                    "amount": "",
                    "unit": "g",
                    "daily_value": ""
                },
                "trans_fat": {
                    "amount": "",
                    "unit": "g"
                },
                "cholesterol": {
                    "amount": "",
                    "unit": "mg",
                    "daily_value": ""
                },
                "sodium": {
                    "amount": "",
                    "unit": "mg",
                    "daily_value": ""
                },
                "total_carbohydrates": {
                    "amount": "",
                    "unit": "g",
                    "daily_value": ""
                },
                "dietary_fiber": {
                    "amount": "",
                    "unit": "g",
                    "daily_value": ""
                },
                "total_sugars": {
                    "amount": "",
                    "unit": "g"
                },
                "added_sugars": {
                    "amount": "",
                    "unit": "g",
                    "daily_value": ""
                },
                "protein": {
                    "amount": "",
                    "unit": "g",
                    "daily_value": ""
                }
            },
            "vitamins_minerals": {
                "vitamin_d": {
                    "amount": "",
                    "unit": "mcg",
                    "daily_value": ""
                },
                "calcium": {
                    "amount": "",
                    "unit": "mg",
                    "daily_value": ""
                },
                "iron": {
                    "amount": "",
                    "unit": "mg",
                    "daily_value": ""
                },
                "potassium": {
                    "amount": "",
                    "unit": "mg",
                    "daily_value": ""
                }
            }
        },
        "ingredients": [],
        "allergens": [],
        "dietary_info": {
            "is_vegetarian": false,
            "is_vegan": false,
            "is_gluten_free": false
        },
        "storage_instructions": "",
        "manufacturer_info": ""
    }
    """

    return process_gemini_response(image_path, prompt)

def analyze_raw_food(image_path):
    """
    Analyze images of raw foods (fruits, vegetables, etc.)
    """
    prompt = """
    Analyze this food image and provide information in the following JSON format:
    {
        "food_identification": {
            "items": [],
            "total_items": 0
        },
        "nutritional_info": [
            {
                "food_name": "",
                "serving_size": "",
                "nutrition_facts": {
                    "calories": "",
                    "macronutrients": {
                        "protein": "",
                        "carbohydrates": "",
                        "fiber": "",
                        "sugars": "",
                        "total_fat": ""
                    },
                    "vitamins_minerals": {
                        "vitamin_c": "",
                        "vitamin_a": "",
                        "potassium": "",
                        "calcium": ""
                    }
                },
                "health_benefits": [],
                "storage_tips": []
            }
        ],
        "combination_suggestions": [],
        "seasonal_info": {}
    }
    """

    return process_gemini_response(image_path, prompt)

def process_gemini_response(image: Image.Image, prompt: str) -> dict:
    """
    Process image with Gemini and handle response
    """
    try:
        response = model.generate_content([prompt, image])
        
        # Log the raw response for debugging
        print("Raw Gemini response:", response.text)

        # Extract and parse JSON
        json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            json_str = json_str.replace('True', 'true').replace('False', 'false')
            try:
                result = json.loads(json_str)
                return result
            except json.JSONDecodeError as e:
                return {"error": f"Error parsing JSON response: {str(e)}"}
        else:
            return {"error": "No valid JSON found in response"}

    except Exception as e:
        return {"error": f"Error processing with Gemini: {str(e)}"}


def generate_analysis_summary(result):
    """
    Generate summary based on the type of food (packaged or raw)
    """
    summary = {
        "type": "packaged" if "product_info" in result else "raw",
        "nutritional_highlights": [],
        "health_score": 0,
        "recommendations": []
    }

    if summary["type"] == "packaged":
        # Analysis for packaged products
        calories = result["nutrition_facts"]["calories"]
        protein = result["nutrition_facts"]["macronutrients"]["protein"]
        summary["nutritional_highlights"].append(f"Calories per serving: {calories}")
        summary["nutritional_highlights"].append(f"Protein per serving: {protein}")
    else:
        # Analysis for raw foods
        for item in result["nutritional_info"]:
            summary["nutritional_highlights"].append(
                f"{item['food_name']}: {item['nutrition_facts']['calories']} calories per serving"
            )

    return summary

def generate_health_insights(result):
    """
    Generate health insights based on nutritional content
    """
    insights = {
        "dietary_considerations": [],
        "nutrient_density_score": 0,
        "health_benefits": [],
        "consumption_tips": []
    }

    # Add relevant insights based on the type of food
    if "product_info" in result:  # Packaged product
        process_packaged_food_insights(result, insights)
    else:  # Raw food
        process_raw_food_insights(result, insights)

    return insights

def process_packaged_food_insights(result, insights):
    """
    Enhanced insights for packaged foods
    """
    try:
        nutrition = result["nutrition_facts"]

        # Analyze macronutrient balance
        protein = float(nutrition["macronutrients"]["protein"]["amount"])
        carbs = float(nutrition["macronutrients"]["total_carbohydrates"]["amount"])
        fat = float(nutrition["macronutrients"]["total_fat"]["amount"])

        # Calculate macronutrient distribution
        total_macros = protein + carbs + fat
        if total_macros > 0:
            macro_distribution = {
                "protein_percentage": round((protein / total_macros) * 100, 1),
                "carbs_percentage": round((carbs / total_macros) * 100, 1),
                "fat_percentage": round((fat / total_macros) * 100, 1)
            }

            insights["macro_distribution"] = macro_distribution

        # Analyze sugar content
        if "total_sugars" in nutrition["macronutrients"]:
            sugar_content = float(nutrition["macronutrients"]["total_sugars"]["amount"])
            if sugar_content > 10:
                insights["dietary_considerations"].append("High in sugar")
            elif sugar_content < 5:
                insights["dietary_considerations"].append("Low in sugar")

        # Analyze sodium content
        if "sodium" in nutrition["macronutrients"]:
            sodium = float(nutrition["macronutrients"]["sodium"]["amount"])
            if sodium > 400:
                insights["dietary_considerations"].append("High in sodium")
            elif sodium < 140:
                insights["dietary_considerations"].append("Low in sodium")

        # Check for allergens
        if result["allergens"]:
            insights["dietary_considerations"].append(
                f"Contains allergens: {', '.join(result['allergens'])}"
            )

    except Exception as e:
        insights["dietary_considerations"].append("Unable to complete full nutritional analysis")

def process_raw_food_insights(result, insights):
    """
    Process insights for raw foods
    """
    for item in result["nutritional_info"]:
        insights["health_benefits"].extend(item["health_benefits"])
        insights["consumption_tips"].append(
            f"Best ways to consume {item['food_name']}: {item['storage_tips']}"
        )

def print_comprehensive_report(result):
    """
    Print detailed analysis report
    """
    print("\n🍎 FOOD ANALYSIS REPORT 🍎")
    print("=" * 50)

    # Determine type of food and print appropriate information
    if "product_info" in result:
        print_packaged_food_report(result)
    else:
        print_raw_food_report(result)

    # Print common sections
    print("\n📊 ANALYSIS SUMMARY")
    print("-" * 30)
    for highlight in result["analysis_summary"]["nutritional_highlights"]:
        print(f"• {highlight}")

    print("\n💡 HEALTH INSIGHTS")
    print("-" * 30)
    for insight in result["health_insights"]["health_benefits"]:
        print(f"• {insight}")

def print_packaged_food_report(result):
    """
    Enhanced report printing for packaged foods
    """
    print("\n📦 PACKAGED FOOD ANALYSIS")
    print("=" * 50)

    # Product Information
    print(f"\nProduct: {result['product_info']['product_name']}")
    print(f"Brand: {result['product_info']['brand']}")
    print(f"Package Size: {result['product_info']['package_size']}")

    # Serving Information
    serving = result['nutrition_facts']['serving_size']
    print(f"\nServing Size: {serving['amount']} {serving['unit']}")
    print(f"Servings Per Container: {serving['servings_per_container']}")

    # Nutrition Facts
    print("\n📊 NUTRITION FACTS")
    print("-" * 30)
    print(f"Calories: {result['nutrition_facts']['calories']}")

    # Macronutrients
    print("\nMacronutrients:")
    macros = result['nutrition_facts']['macronutrients']
    for nutrient, data in macros.items():
        if isinstance(data, dict) and 'amount' in data:
            dv = f" ({data['daily_value']}% DV)" if 'daily_value' in data and data['daily_value'] else ""
            print(f"• {nutrient.replace('_', ' ').title()}: {data['amount']}{data['unit']}{dv}")

    # Vitamins & Minerals
    print("\nVitamins & Minerals:")
    vitamins = result['nutrition_facts']['vitamins_minerals']
    for nutrient, data in vitamins.items():
        if isinstance(data, dict) and 'amount' in data:
            print(f"• {nutrient.replace('_', ' ').title()}: {data['amount']}{data['unit']} ({data['daily_value']}% DV)")

    # Ingredients
    if result['ingredients']:
        print("\nIngredients:")
        print(", ".join(result['ingredients']))

    # Allergens
    if result['allergens']:
        print("\n⚠️ Allergens:")
        print(", ".join(result['allergens']))

    # Dietary Information
    print("\nDietary Information:")
    for diet, value in result['dietary_info'].items():
        print(f"• {diet.replace('_', ' ').title()}: {'Yes' if value else 'No'}")

    # Storage Instructions
    if result['storage_instructions']:
        print(f"\nStorage: {result['storage_instructions']}")

def print_raw_food_report(result):
    """
    Print report for raw food
    """
    print(f"\nIdentified Items: {result['food_identification']['total_items']}")

    for item in result["nutritional_info"]:
        print(f"\n{item['food_name'].upper()}")
        print(f"Serving Size: {item['serving_size']}")
        print("Nutrition Facts:")
        print(f"• Calories: {item['nutrition_facts']['calories']}")

        print("\nHealth Benefits:")
        for benefit in item["health_benefits"]:
            print(f"• {benefit}")

# Main function to use
def analyze_food(image_path):
    """
    Complete food analysis with detailed report
    """
    result = analyze_food_image(image_path)

    if "error" in result:
        print(f"Error: {result['error']}")
        return

    print_comprehensive_report(result)
    return result

# Usage example:
# result = analyze_food("path_to_your_food_image.jpg")