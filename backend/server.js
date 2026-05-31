import exp from "express";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
import companyRoutes from "./routes/companyRoutes.js"
import drivesRoutes from "./routes/drivesRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import cors from 'cors';

const app=exp();
app.use(exp.json());
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5173',
    'https://smart-placement-tracker-rust.vercel.app'
  ],
  credentials: true
}));

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/company",
    companyRoutes
)

app.use(
    "/api/drive",
    drivesRoutes
)

app.use(
    "/api/application",
    applicationRoutes
)

app.use(
    "/api/notification",
    notificationRoutes
)


connectDB();
app.listen(4000,()=>{console.log("From port 4000")});


// dealing  with invalid path
app.use((req,res,next)=>{
  console.log(req.url)
  res.json({message:`${req.url} is invalid path`});
})



// error handling middleware
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error:` ${field} "${value}" already exists,`
    });
  }

  // ✅ HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});