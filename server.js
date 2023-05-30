import "express-async-errors";
import express from "express";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import authController from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import cors from "cors";
import morgan from "morgan";
import authenticateUser from "./middleware/auth.js";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize  from "express-mongo-sanitize";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config();
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

app.use(cors());
if (process.env.NODE_ENV !== 'PRODUCTION') {
    app.use(morgan('dev'))
}
app.use(express.json())
// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')))
app.use(express.urlencoded({ extended:false }))

app.use('/app/v1/auth',authController);
app.use('/app/v1/jobs',authenticateUser,jobRoutes);
app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'./client/build','index.html'))
})

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(PORT,() => {
            console.log(`app running successfully at port: ${PORT}`);
        })
    } catch (error) {
        console.log(error);  
    }
}

start();