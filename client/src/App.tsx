import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Explore = lazy(() => import("./pages/Explore"));
const Documents = lazy(() => import("./pages/Documents"));
const DownPayment = lazy(() => import("./pages/DownPayment"));
const Agreement = lazy(() => import("./pages/Agreement"));

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path="/explore">
              <Suspense fallback={<div className="explore-boot" />}>
                <Explore />
              </Suspense>
            </Route>
            <Route path="/documents">
              <Suspense fallback={<div className="explore-boot" />}>
                <Documents />
              </Suspense>
            </Route>
            <Route path="/down-payment">
              <Suspense fallback={<div className="explore-boot" />}>
                <DownPayment />
              </Suspense>
            </Route>
            <Route path="/agreement">
              <Suspense fallback={<div className="explore-boot" />}>
                <Agreement />
              </Suspense>
            </Route>
            <Route component={Home} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
