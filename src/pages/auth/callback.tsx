import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/integrations/supabase/client';
import { SEO } from '@/components/SEO';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.push('/auth/login?error=auth_failed');
          return;
        }

        if (session) {
          // Check if user has completed onboarding
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, onboarding_completed, kyc_status')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            router.push('/auth/login?error=profile_not_found');
            return;
          }

          // Redirect based on role and onboarding status
          if (!profile.onboarding_completed) {
            router.push('/auth/onboarding');
          } else if (profile.kyc_status !== "VERIFIED") {
            router.push('/dashboard/verification');
          } else {
            // Redirect to appropriate dashboard based on role
            const dashboardMap: Record<string, string> = {
              investor: '/dashboard/investor',
              franchise_partner: '/dashboard/franchise',
              admin: '/dashboard/admin',
              super_admin: '/dashboard/admin',
              vendor: '/dashboard/vendor',
              client: '/dashboard/client',
              bdm: '/dashboard/bdm',
            };

            const key = String(profile.role || "").toLowerCase();
            router.push(dashboardMap[key] || '/dashboard');
          }
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Callback error:', error);
        router.push('/auth/login?error=unexpected');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <>
      <SEO title="Authenticating..." />
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    </>
  );
}