//
//  CellTest.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 15/03/13.
//
//

#import "CellTest.h"
#import "Poop.h"
#import "Poop+Poop_ImageCache.h"

@interface CellTest()
@property (weak, nonatomic) IBOutlet UILabel *lblCagao;
@property (weak, nonatomic) IBOutlet UILabel *lblCoco;
@property (weak, nonatomic) IBOutlet UIImageView *imgCoco;
@property (strong, nonatomic) NSString* url;

@end

@implementation CellTest

@synthesize poop = _poop, url = _url;

static NSMutableDictionary* _imgs = nil;
static NSHashTable* imgsLoaded = nil;

dispatch_queue_t _bkg_queue;


-(NSMutableDictionary*)imgs{
    if (!_imgs) {
        
        _imgs = [[NSMutableDictionary alloc] init];
    }
    return _imgs;
}

-(void)dealloc{

    if (_bkg_queue) {
        dispatch_release(_bkg_queue);
    }
    _imgs = nil;
    
}

-(dispatch_queue_t)bkg_queue{
    if (!_bkg_queue)
        _bkg_queue = dispatch_queue_create("com.iTimerPro.imageloader.bgqueue", NULL);
    return _bkg_queue;
}




void UIImageFromURL( NSURL * URL, void (^imageBlock)(UIImage * image), void (^errorBlock)(void) )
{
    
    dispatch_async( NULL
                   , ^(void)
                   {
                       NSData * data = [[NSData alloc] initWithContentsOfURL:URL];
                       UIImage * image = [[UIImage alloc] initWithData:data];
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
/*
+(void)getImage:(NSString*)url
       onFinish:(void(^)(NSString* url,UIImage* img))block {

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
                       block(url, image);
                   },
                   ^{
                       ;
                   });
}
*/
-(void)getimg: (NSString*) url{
    [self.imgCoco setImage:nil];
    NSLog(@"total:%d", self.imgs.count);
    if ([[self.imgs objectForKey:url] class] == [UIImage class]) {
        [self.imgCoco setImage:[self.imgs objectForKey:url]];
        NSLog(@"Achou-%@", url);
        return;
    }
    
    dispatch_async( self.bkg_queue, ^(void)
                   {
                       NSObject* x = [self.imgs objectForKey:url];
                       if ([x class]== [NSNumber class] &&
                           [[self.imgs objectForKey:url] class] == [UIImage class]) {
                           return;
                       }
                       
                       
                       [self.imgs setObject:[[NSNumber alloc] initWithBool:YES] forKey:url];
                       NSLog(@"2-%@", url);
                       NSLog(@"3-%@", self.url);
                       
                       NSData * data = [[NSData alloc] initWithContentsOfURL:[NSURL URLWithString:url]];
                       UIImage * image = [[UIImage alloc] initWithData:data];
                       [self.imgs setObject:image forKey:url];
                       
                       if ([url isEqualToString:self.url]) {

                           if( image != nil)
                               dispatch_async( dispatch_get_main_queue(), ^(void){
                                   [self.imgCoco setImage:image];
                               });
                       }
                       
                       
                       
                   });
/*
    NSLog(@"%@ - %@", self.url, _poop.url);
    
    if ([_poop.url isEqualToString:self.url])
        NSLog(@"are equal.");
    else
        NSLog(@"are not equal.");
    
    
    NSData * data = [[NSData alloc] initWithContentsOfURL:[NSURL URLWithString:_poop.url]];
    
    UIImage * image = [[UIImage alloc] initWithData:data];
    if( image != nil)
        dispatch_async( dispatch_get_main_queue(), ^(void){
            [self.imgCoco setImage:image];
        });
*/
}
-(void)setPoop:(Poop *)poop{

    _poop = poop;
    [self.lblCagao setText:poop.artist];
    [self.lblCoco setText:poop.masterPiece];
    [self setUrl: [poop.url copy]];
    
    [self getimg:poop.url];
    
    
/*
    [poop loadImgCache:^(Poop *ppoop, UIImage* image) {
        if ([ppoop.url isEqualToString:_poop.url]) {
            [self.imgCoco setImage:image];
        }
        ;
    }];
 */
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


@end
