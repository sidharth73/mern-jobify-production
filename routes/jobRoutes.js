import express from "express";
const router = express.Router();
import { createJob, showStats, deleteJob, getAllJobs, updateJob, monthlyApplications } from "../controllers/jobController.js";


router.route('/').post(createJob).get(getAllJobs);
router.route('/stats').get(showStats);
router.route('/:id').delete(deleteJob).patch(updateJob);
router.route('/stats').get(monthlyApplications);

export default router;