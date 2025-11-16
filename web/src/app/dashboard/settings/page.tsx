"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/contexts/settings-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { graphDataPoints, setGraphDataPoints, isDarkMode, setDarkMode } = useSettings();
  const [localValue, setLocalValue] = useState(graphDataPoints);
  const [inputValue, setInputValue] = useState(graphDataPoints.toString());

  useEffect(() => {
    setLocalValue(graphDataPoints);
    setInputValue(graphDataPoints.toString());
  }, [graphDataPoints]);

  const handleSliderChange = (value: number[]) => {
    setLocalValue(value[0]);
    setInputValue(value[0].toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 10 && numValue <= 500) {
      setLocalValue(numValue);
    }
  };

  const handleSave = () => {
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue >= 10 && numValue <= 500) {
      setGraphDataPoints(numValue);
    } else {
      setInputValue(localValue.toString());
    }
  };

  const handleReset = () => {
    const defaultValue = 50;
    setLocalValue(defaultValue);
    setInputValue(defaultValue.toString());
    setGraphDataPoints(defaultValue);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your dashboard preferences and data visualization options
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode" className="text-base font-medium">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable dark theme for better viewing in low light conditions
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Graph Data Points</CardTitle>
            <CardDescription>
              Set the number of data points displayed in graphs. More points show more history but may affect performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dataPoints" className="text-base">
                  Number of Data Points
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="dataPoints"
                    type="number"
                    min={10}
                    max={500}
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-24 text-center"
                  />
                  <span className="text-sm text-muted-foreground">/ 500</span>
                </div>
              </div>

              <div className="pt-4">
                <Slider
                  value={[localValue]}
                  onValueChange={handleSliderChange}
                  min={10}
                  max={500}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>10 points</span>
                  <span>250 points</span>
                  <span>500 points</span>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current setting:</span>
                  <span className="font-semibold">{graphDataPoints} points</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">New setting:</span>
                  <span className="font-semibold">{localValue} points</span>
                </div>
                {localValue !== graphDataPoints && (
                  <div className="text-xs text-amber-600 dark:text-amber-400 pt-2 border-t border-border">
                    Click "Save Changes" to apply the new setting
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSave} 
                disabled={localValue === graphDataPoints}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button 
                onClick={handleReset} 
                variant="outline"
                className="flex-1"
              >
                Reset to Default (50)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Graph Data Points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Lower values (10-50):</strong> Faster loading, less history, ideal for real-time monitoring
            </p>
            <p>
              <strong className="text-foreground">Medium values (50-200):</strong> Balanced performance and history view
            </p>
            <p>
              <strong className="text-foreground">Higher values (200-500):</strong> More historical data, slower updates, better for trend analysis
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

