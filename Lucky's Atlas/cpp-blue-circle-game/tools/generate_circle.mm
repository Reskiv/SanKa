#import <CoreGraphics/CoreGraphics.h>
#import <Foundation/Foundation.h>
#import <ImageIO/ImageIO.h>

#include <iostream>

int main(int argc, const char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: generate-circle <output.png>\n";
        return 1;
    }

    constexpr size_t size = 256;
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef context = CGBitmapContextCreate(
        nullptr, size, size, 8, size * 4, colorSpace,
        kCGImageAlphaPremultipliedLast);
    CGColorSpaceRelease(colorSpace);

    if (!context) {
        std::cerr << "Could not create the image canvas.\n";
        return 1;
    }

    CGContextClearRect(context, CGRectMake(0, 0, size, size));
    CGContextSetRGBFillColor(context, 40.0 / 255.0, 120.0 / 255.0,
                             232.0 / 255.0, 1.0);
    CGContextFillEllipseInRect(context, CGRectMake(4, 4, 248, 248));

    CGImageRef image = CGBitmapContextCreateImage(context);
    CGContextRelease(context);
    if (!image) {
        std::cerr << "Could not create the final image.\n";
        return 1;
    }

    @autoreleasepool {
        NSString* outputPath = [NSString stringWithUTF8String:argv[1]];
        NSURL* outputURL = [NSURL fileURLWithPath:outputPath];
        CGImageDestinationRef destination = CGImageDestinationCreateWithURL(
            (__bridge CFURLRef)outputURL, CFSTR("public.png"), 1, nullptr);
        if (!destination) {
            std::cerr << "Could not open the PNG output.\n";
            CGImageRelease(image);
            return 1;
        }

        CGImageDestinationAddImage(destination, image, nullptr);
        const bool saved = CGImageDestinationFinalize(destination);
        CFRelease(destination);
        CGImageRelease(image);

        if (!saved) {
            std::cerr << "Could not save the PNG.\n";
            return 1;
        }
    }

    return 0;
}
