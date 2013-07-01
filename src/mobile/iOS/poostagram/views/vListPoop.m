//
//  vListPoop.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 15/03/13.
//
//

#import "vListPoop.h"

@interface vListPoop()
@property (weak, nonatomic) IBOutlet UIScrollView *poopScroll;


@end

@implementation vListPoop

-(void)loadPoop: (id)item{
    
    [self.poopScroll contentInset];
    
}

-(void)addPoop {

    NSLog(@"passei");
    
}


- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code
    }
    return self;
}
/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect
{
    // Drawing code
}
*/

@end
