import { apiClient } from '@/shared/api'
import type { DashboardStats } from '../types'

export const dashboardApi = {
  /**
   * Get dashboard statistics
   * @param days - Number of days for revenue chart (default: 30)
   */
  getDashboardStats: async (days: number = 30): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/analytics/dashboard', {
      params: { days },
    })
    return response.data
  },
}
