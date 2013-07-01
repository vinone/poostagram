//
//  vBKtb.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 16/03/13.
//
//

#import "vBGtb.h"
#import "vcPostPoop.h"
@interface vBGtb()
@property (strong,nonatomic) UIImage *image;

@end

@implementation vBGtb

@synthesize image = _image;

-(void)didMoveToSuperview{
    self.rowHeight = self.bounds.size.height;
}

-(id)initWithCoder:(NSCoder *)aDecoder{
    self = [super initWithCoder:aDecoder];
    if (self) {
        // Initialization code
    }
    return self;
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code
    }
    return self;
}

-(void)addPoop:(id)sender{
    
}

- (UIViewController*)viewController
{
    for (UIView* next = [self superview]; next; next = next.superview)
    {
        UIResponder* nextResponder = [next nextResponder];
        
        if ([nextResponder isKindOfClass:[UIViewController class]])
        {
            return (UIViewController*)nextResponder;
        }
    }
    
    return nil;
}

-(void)addPoop{
    UIViewController *mvc = [[[self viewController] storyboard] instantiateViewControllerWithIdentifier:@"postPoop"];
    [[self viewController] presentModalViewController:mvc animated:YES];

}

-(void)drawRect:(CGRect)rect{
    // Drawing code
    if (!self.image)
        self.image = [UIImage imageNamed:@"bg.png"];
    
    CGImageRef image = CGImageRetain(self.image.CGImage);
    
    CGRect imageRect;
    imageRect.origin = CGPointMake(0.0, 0.0);
    imageRect.size = CGSizeMake(CGImageGetWidth(image), CGImageGetHeight(image));
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextClipToRect(context, CGRectMake(0.0, 0.0, rect.size.width, rect.size.height));
    CGContextDrawTiledImage(context, imageRect, image);
    CGImageRelease(image);
}

@end
