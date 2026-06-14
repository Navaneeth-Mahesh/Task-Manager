import { Router } from 'express'
import { getStats, getAnalytics, getTeamStats } from '../controllers/dashboardController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/stats', getStats)
router.get('/analytics', getAnalytics)
router.get('/team', getTeamStats) // any authenticated user can see team

export default router
