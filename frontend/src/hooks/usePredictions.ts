
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Prediction {
  id: string;
  disease_type: string;
  input_data: any;
  prediction_result: any;
  confidence_score: number;
  image_url?: string;
  created_at: string;
}

export const usePredictions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['predictions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Prediction[];
    },
    enabled: !!user,
  });
};
