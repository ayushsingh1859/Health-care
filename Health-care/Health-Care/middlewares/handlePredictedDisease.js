// middlewares/handlePredictedDisease.js

const handlePredictedDisease = async (req, res, next) => {
    try {
        // Simulate the prediction process for demonstration
        // Replace this with your actual prediction logic
        const predictedDisease = await performPrediction(); // Call your prediction function here
        
        // Set the predicted disease in the response locals object
        res.locals.predictedDisease = predictedDisease;
        next();
    } catch (error) {
        console.error("Error in handlePredictedDisease middleware:", error);
        next(error); // Pass the error to the error handler middleware
    }
};

// Simulated prediction function
const performPrediction = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const predictedDisease = "Hypertension"; // Simulated predicted disease
            resolve(predictedDisease);
        }, 3000); // Simulate a delay of 3 seconds for prediction
    });
};

module.exports = handlePredictedDisease;
