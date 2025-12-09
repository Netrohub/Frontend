import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageContext } from "@/contexts/LanguageContext";

// Get IS_PRODUCTION from env without throwing if not configured
const IS_PRODUCTION = (() => {
  const nodeEnv = import.meta.env.NODE_ENV || import.meta.env.MODE || 'development';
  return nodeEnv === 'production';
})();

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Route-level Error Boundary
 * Catches errors in route components and displays a user-friendly error message
 * Allows users to navigate back or retry
 */
export class RouteErrorBoundary extends Component<Props, State> {

  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("RouteErrorBoundary caught an error:", error, errorInfo);

    // Log error to error tracking service in production
    if (IS_PRODUCTION) {
      // TODO: Integrate with error tracking service (e.g., Sentry)
      // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  private handleGoHome = () => {
    this.handleReset();
    // Use window.location instead of navigate hook since this is a class component
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <LanguageContext.Consumer>
          {(context) => {
            const { t, language } = context || { t: (key: string) => key, language: 'ar' };
            return (
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
                      <CardTitle>{t('error.500')}</CardTitle>
                    </div>
                    <CardDescription>
                      {t('error.500.desc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!IS_PRODUCTION && this.state.error && (
                      <div className="p-3 bg-destructive/10 rounded-md">
                        <p className="text-sm font-mono text-destructive break-all">
                          {this.state.error.toString()}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        onClick={this.handleReset} 
                        variant="outline" 
                        className="flex-1 focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,70%)]"
                        aria-label={t('errorBoundary.retryAriaLabel')}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                        {t('error.tryAgain')}
                      </Button>
                      <Button 
                        onClick={this.handleGoHome} 
                        className="flex-1 focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,70%)]"
                        aria-label={t('errorBoundary.backToHomeAriaLabel')}
                      >
                        <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                        {t('error.goHome')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          }}
        </LanguageContext.Consumer>
      );
    }

    return this.props.children;
  }
}

