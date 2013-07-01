//
//  CellTest.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 15/03/13.
//
//

#import "CellTest.h"
#import "Poop.h"
@interface CellTest()
@property (weak, nonatomic) IBOutlet UILabel *lblCagao;
@property (weak, nonatomic) IBOutlet UILabel *lblCoco;
@property (weak, nonatomic) IBOutlet UIImageView *imgCoco;

@end

@implementation CellTest

@synthesize poop = _poop;
static NSMutableDictionary* imgs = nil;
static NSHashTable* imgsLoaded = nil;

void UIImageFromURL( NSURL * URL, void (^imageBlock)(UIImage * image), void (^errorBlock)(void) )
{
    dispatch_async( dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0 ), ^(void)
                   {
                       NSData * data = [[NSData alloc] initWithContentsOfURL:URL];
                       UIImage * image = [[UIImage alloc] initWithData:data] ;
                       dispatch_async( dispatch_get_main_queue(), ^(void){
                           if( image != nil )
                           {
                               imageBlock( image );
                           } else {
                               errorBlock();
                           }
                       });
                   });
}


//(void (^)(DataContext* sender, NSManagedObjectContext *pContext))pCompleteHandler

+(void)getImage:(NSString*)url onFinish:(void(^)(NSString* url,UIImage* img))block {
    if (!imgs){
        imgs = [[NSMutableDictionary alloc] init];
        imgsLoaded =[[NSHashTable alloc] init];
    }
    
    UIImage* result = [imgs objectForKey:url];
    if (result)
        block(url, result);
    
    if ([imgsLoaded containsObject:url])
    {
        return;
    }
    
    [imgsLoaded addObject:url];
    UIImageFromURL([NSURL URLWithString:url], ^(UIImage *image)
                   {
                       [imgs setObject:image forKey:url];
                       block(url,image);
                   },
                   ^{
                       ;
                   });
}


-(void)setPoop:(Poop *)poop{
    _poop = poop;
    [self.lblCagao setText:poop.artist];
    [self.lblCoco setText:poop.masterPiece];
    [self.imgCoco setImage:nil];
    
    [CellTest getImage:poop.url onFinish:^(NSString *url, UIImage *img) {
        if ([url isEqualToString:poop.url]) {
            [self.imgCoco setImage:img];
        }
    }];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    
}

-(id)initWithCoder:(NSCoder *)aDecoder{
    self = [super initWithCoder:aDecoder];
    if (self) {
        // Initialization code
    }
    return self;
}

-(id)initWithFrame:(CGRect)frame{
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code
    }
    return self;
}

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        // Initialization code
    }
    return self;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
