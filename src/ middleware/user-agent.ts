import { NextRequest, NextResponse, userAgent } from 'next/server';

export function middleware(request: NextRequest) {
  const { device, browser, os } = userAgent(request);

  // Example conditions to restrict devices
  const isBlockedDevice = device.type === 'tablet'; // Restrict tablets
  const isBlockedBrowser = browser.name === 'IE'; // Restrict Internet Explorer
  const isBlockedOS = os.name === 'Windows' && os?.version.startsWith('7'); // Restrict Windows 7

  if (isBlockedDevice || isBlockedBrowser || isBlockedOS) {
    // Respond with a 403 Forbidden response
    return NextResponse.json(
      { message: 'Your device is not supported.' },
      { status: 403 }
    );
  }

  // Allow the request to proceed
  return NextResponse.next();
}
