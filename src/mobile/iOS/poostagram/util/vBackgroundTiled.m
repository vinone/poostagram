//
//  vBackgroundTiled.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 15/03/13.
//
//

#import "vBackgroundTiled.h"

@interface vBackgroundTiled()

@end


@implementation vBackgroundTiled



UIImage *image_ = nil;


- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        
    }
    return self;

}


- (void)drawRect:(CGRect)rect {
    // Drawing code
    if (!image_)
        image_ = [UIImage imageNamed:@"bg.png"];

    CGImageRef image = CGImageRetain(image_.CGImage);
    
    CGRect imageRect;
    imageRect.origin = CGPointMake(0.0, 0.0);
    imageRect.size = CGSizeMake(CGImageGetWidth(image), CGImageGetHeight(image));
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextClipToRect(context, CGRectMake(0.0, 0.0, rect.size.width, rect.size.height));
    CGContextDrawTiledImage(context, imageRect, image);
    CGImageRelease(image);
}


@end
