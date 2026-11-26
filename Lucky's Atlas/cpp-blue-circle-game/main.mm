#import <Cocoa/Cocoa.h>

#include <cmath>
#include <filesystem>
#include <iostream>
#include <string>
#include <string_view>

namespace {
constexpr CGFloat kWindowWidth = 640.0;
constexpr CGFloat kWindowHeight = 480.0;
constexpr CGFloat kCircleSize = 128.0;
constexpr CGFloat kCircleX = (kWindowWidth - kCircleSize) / 2.0;
constexpr CGFloat kCircleY = 128.0;
NSString* const kClickMessage = @"dont touch me";

NSString* assetPathFromExecutable(const char* executablePath) {
    std::filesystem::path path = std::filesystem::absolute(executablePath);
    path = path.parent_path() / "assets" / "blue_circle.png";
    return [NSString stringWithUTF8String:path.string().c_str()];
}

bool isInsideCircle(CGFloat x, CGFloat y) {
    const CGFloat centerX = kCircleX + kCircleSize / 2.0;
    const CGFloat centerY = kCircleY + kCircleSize / 2.0;
    const CGFloat deltaX = x - centerX;
    const CGFloat deltaY = y - centerY;
    const CGFloat radius = kCircleSize / 2.0;
    return (deltaX * deltaX) + (deltaY * deltaY) <= radius * radius;
}

int runSelfTest(NSString* imagePath) {
    NSImage* image = [[NSImage alloc] initWithContentsOfFile:imagePath];
    const bool imageLoads = image != nil;
    const bool centerActivates = isInsideCircle(kCircleX + kCircleSize / 2.0,
                                                kCircleY + kCircleSize / 2.0);
    const bool transparentCornerDoesNotActivate =
        !isInsideCircle(kCircleX, kCircleY);
    const bool messageIsExact = [kClickMessage isEqualToString:@"dont touch me"];

    if (imageLoads && centerActivates && transparentCornerDoesNotActivate &&
        messageIsExact) {
        std::cout << "Self-test passed: PNG load, circular hit-test, and message.\n";
        return 0;
    }

    std::cerr << "Self-test failed.\n";
    return 1;
}
}  // namespace

@interface GameView : NSView
- (instancetype)initWithFrame:(NSRect)frame imagePath:(NSString*)imagePath;
@end

@implementation GameView {
    NSImage* _circleImage;
    NSString* _message;
}

- (instancetype)initWithFrame:(NSRect)frame imagePath:(NSString*)imagePath {
    self = [super initWithFrame:frame];
    if (self) {
        _circleImage = [[NSImage alloc] initWithContentsOfFile:imagePath];
        if (!_circleImage) {
            std::cerr << "Could not load PNG: "
                      << [imagePath UTF8String] << '\n';
            return nil;
        }
    }
    return self;
}

- (BOOL)isFlipped {
    return YES;
}

- (BOOL)acceptsFirstResponder {
    return YES;
}

- (void)drawRect:(NSRect)dirtyRect {
    [super drawRect:dirtyRect];

    [[NSColor colorWithRed:0.96 green:0.98 blue:1.0 alpha:1.0] setFill];
    NSRectFill(self.bounds);

    NSDictionary* titleStyle = @{
        NSFontAttributeName: [NSFont boldSystemFontOfSize:26.0],
        NSForegroundColorAttributeName: [NSColor colorWithWhite:0.12 alpha:1.0]
    };
    [@"Click the blue circle" drawAtPoint:NSMakePoint(205.0, 50.0)
                            withAttributes:titleStyle];

    const NSRect circleRect = NSMakeRect(kCircleX, kCircleY,
                                         kCircleSize, kCircleSize);
    [_circleImage drawInRect:circleRect
                    fromRect:NSZeroRect
                   operation:NSCompositingOperationSourceOver
                    fraction:1.0];

    if (_message) {
        NSDictionary* messageStyle = @{
            NSFontAttributeName: [NSFont boldSystemFontOfSize:30.0],
            NSForegroundColorAttributeName:
                [NSColor colorWithRed:0.08 green:0.23 blue:0.55 alpha:1.0]
        };
        const NSSize size = [_message sizeWithAttributes:messageStyle];
        const NSPoint point = NSMakePoint((kWindowWidth - size.width) / 2.0,
                                          305.0);
        [_message drawAtPoint:point withAttributes:messageStyle];
    }
}

- (void)mouseDown:(NSEvent*)event {
    const NSPoint point = [self convertPoint:event.locationInWindow
                                     fromView:nil];

    // Circular hit-testing means transparent PNG corners do not count as clicks.
    if (isInsideCircle(point.x, point.y)) {
        _message = kClickMessage;
        [self setNeedsDisplay:YES];
    }
}

@end

@interface AppDelegate : NSObject <NSApplicationDelegate>
- (instancetype)initWithImagePath:(NSString*)imagePath;
@end


@implementation AppDelegate {
    NSWindow* _window;
    NSString* _imagePath;
}

- (instancetype)initWithImagePath:(NSString*)imagePath {
    self = [super init];
    if (self) {
        _imagePath = [imagePath copy];
    }
    return self;
}

- (void)applicationDidFinishLaunching:(NSNotification*)notification {
    (void)notification;

    const NSRect frame = NSMakeRect(0.0, 0.0, kWindowWidth, kWindowHeight);
    _window = [[NSWindow alloc]
        initWithContentRect:frame
                  styleMask:(NSWindowStyleMaskTitled |
                             NSWindowStyleMaskClosable |
                             NSWindowStyleMaskMiniaturizable)
                    backing:NSBackingStoreBuffered
                      defer:NO];
    _window.title = @"Blue Circle Game";
    _window.releasedWhenClosed = NO;

    GameView* gameView = [[GameView alloc] initWithFrame:frame
                                               imagePath:_imagePath];
    if (!gameView) {
        [NSApp terminate:nil];
        return;
    }

    _window.contentView = gameView;
    [_window center];
    [_window makeKeyAndOrderFront:nil];
    [NSApp activateIgnoringOtherApps:YES];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication*)sender {
    (void)sender;
    return YES;
}

@end


int main(int argc, const char* argv[]) {
    @autoreleasepool {
        if (argc < 1) {
            return 1;
        }

        NSString* imagePath = assetPathFromExecutable(argv[0]);
        if (argc == 2 && std::string_view(argv[1]) == "--self-test") {
            return runSelfTest(imagePath);
        }

        NSApplication* app = [NSApplication sharedApplication];
        app.activationPolicy = NSApplicationActivationPolicyRegular;

        AppDelegate* delegate =
            [[AppDelegate alloc] initWithImagePath:imagePath];
        app.delegate = delegate;
        [app run];
    }
    return 0;
}
