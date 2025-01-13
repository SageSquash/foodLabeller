from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
import logging
from app.food_analyzer import analyze_food_image
from app.database import get_db, SessionLocal
from app.models import FoodScan

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(title="Food Analyzer API")

# Enable CORS - Update this with all your frontend URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Food Analyzer API",
        "version": "1.0",
        "endpoints": {
            "analyze": "/analyze",
            "health": "/health",
            "history": "/history"
        }
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "api_version": "1.0",
        "database": "connected"
    }

@app.post("/analyze")
async def analyze_food(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}")
        
        # Read file contents
        contents = await file.read()
        logger.info(f"File size: {len(contents)} bytes")
        
        try:
            image = Image.open(io.BytesIO(contents))
            logger.info(f"Image opened successfully. Size: {image.size}, Mode: {image.mode}")
            
            if image.mode not in ('RGB', 'L'):
                image = image.convert('RGB')
                logger.info("Converted image to RGB mode")
            
            # Analyze image
            result = analyze_food_image(image)
            logger.info("Analysis completed")
            
            return JSONResponse(content=result)
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history():
    db = SessionLocal()
    try:
        scans = db.query(FoodScan).order_by(FoodScan.created_at.desc()).all()
        return [
            {
                "id": scan.id,
                "image_path": scan.image_path,
                "scan_result": scan.scan_result,
                "created_at": scan.created_at,
                "food_type": scan.food_type
            }
            for scan in scans
        ]
    finally:
        db.close()

@app.post("/analyze")
async def analyze_food(file: UploadFile = File(...)):
    try:
        logger.info(f"Starting analysis for file: {file.filename}")
        
        # Log file details
        contents = await file.read()
        logger.info(f"File size: {len(contents)} bytes")
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            logger.warning(f"Invalid content type received: {file.content_type}")
            raise HTTPException(
                status_code=400,
                detail=f"File must be an image. Received: {file.content_type}"
            )

        # Process image
        try:
            image = Image.open(io.BytesIO(contents))
            logger.info(f"Image opened successfully. Size: {image.size}, Mode: {image.mode}")
            
            if image.mode not in ('RGB', 'L'):
                logger.info(f"Converting image from {image.mode} to RGB")
                image = image.convert('RGB')
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid image format")

        # Analyze image
        logger.info("Starting image analysis...")
        result = analyze_food_image(image)
        logger.info("Analysis completed")
        
        if isinstance(result, dict) and "error" in result:
            logger.error(f"Analysis error: {result['error']}")
            raise HTTPException(status_code=400, detail=result["error"])

        # Store in database
        logger.info("Storing result in database...")
        db = SessionLocal()
        try:
            food_scan = FoodScan(
                image_path=file.filename,
                scan_result=result,
                food_type="packaged" if "product_info" in result else "raw"
            )
            db.add(food_scan)
            db.commit()
            logger.info("Result stored successfully")
        except Exception as e:
            logger.error(f"Database error: {str(e)}")
            raise
        finally:
            db.close()

        return JSONResponse(content=result)

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)