'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  location: string;
  humidity: number;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: 'sunny',
    location: 'New York',
    humidity: 65,
  });

  useEffect(() => {
    // Simulate weather data updates
    const interval = setInterval(() => {
      const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      setWeather(prev => ({
        ...prev,
        temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
        condition: randomCondition,
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Thermometer className="h-4 w-4" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{weather.temperature}°C</p>
            <p className="text-sm text-muted-foreground">{weather.location}</p>
          </div>
          {getWeatherIcon(weather.condition)}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Humidity</span>
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Condition</span>
            <span className="capitalize">{weather.condition}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}