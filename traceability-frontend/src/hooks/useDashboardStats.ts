import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const [
        farmersResult,
        plotsResult,
        collectionPointsResult,
        transactionsResult,
        validationsResult,
      ] = await Promise.all([
        supabase.from('farmers').select('id', { count: 'exact', head: true }),
        supabase.from('plots').select('id, area_rai', { count: 'exact' }),
        supabase.from('collection_points').select('id', { count: 'exact', head: true }),
        supabase.from('receiving_transactions')
          .select('net_weight_kg, dry_rubber_kg')
          .gte('transaction_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
        supabase.from('validations').select('is_over_limit'),
      ]);

      const totalFarmers = farmersResult.count || 0;
      const totalPlots = plotsResult.count || 0;
      const totalArea = plotsResult.data?.reduce((sum, p) => sum + (Number(p.area_rai) || 0), 0) || 0;
      const totalCollectionPoints = collectionPointsResult.count || 0;
      const monthlyWeight = transactionsResult.data?.reduce((sum, t) => sum + (Number(t.net_weight_kg) || 0), 0) || 0;
      const overLimitCount = validationsResult.data?.filter(v => v.is_over_limit).length || 0;
      const totalValidations = validationsResult.data?.length || 0;

      return {
        totalFarmers,
        totalPlots,
        totalArea,
        totalCollectionPoints,
        monthlyWeight,
        overLimitCount,
        totalValidations,
        complianceRate: totalValidations > 0 ? ((totalValidations - overLimitCount) / totalValidations * 100).toFixed(1) : '100',
      };
    },
  });
}
