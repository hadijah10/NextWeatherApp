import { NextRequest,NextResponse } from "next/server"

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const address = params.get('address');
  const latitude = params.get('lat');
  const longitude = params.get('lon');
    
  let url = "";
  if(address){
    url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${process.env.WEATHER_API_KEY}`;
  }
  else{
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`
  }
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json({data});
}
