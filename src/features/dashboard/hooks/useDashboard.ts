import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboardApi'

export const useDashboardStats = (days: number = 30) => {
  return useQuery({
    queryKey: ['dashboard', 'stats', days],
    queryFn: () => dashboardApi.getDashboardStats(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
