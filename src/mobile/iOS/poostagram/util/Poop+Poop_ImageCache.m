//
//  Poop+Poop_ImageCache.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 20/03/13.
//
//

#import "Poop+Poop_ImageCache.h"
#import "Poop.h"

@implementation Poop (Poop_ImageCache)

-(NSURL*)localFile{

    NSURL* localURL = [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];
    NSString* source = [[self.url stringByReplacingOccurrencesOfString:@"https://" withString:@""] stringByReplacingOccurrencesOfString:@"/" withString:@"-"];
    return [localURL URLByAppendingPathComponent:source];

}
void UIImageFromURLToLocalFile( NSURL * remoteURL, NSURL * localURL, void (^imageBlock)(UIImage*image) )
{
    dispatch_async( dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0 ), ^(void)
                   {
                       
                       NSData * data;
                       
                       if([[NSFileManager defaultManager] fileExistsAtPath:[localURL path]])
                           data = [[NSData alloc] initWithContentsOfURL:localURL];
                       else
                       {
                           data = [[NSData alloc] initWithContentsOfURL:remoteURL];
                           [data writeToURL:localURL atomically:YES];
                       }
                       
                       UIImage * image = [[UIImage alloc] initWithData:data] ;
                       dispatch_async( dispatch_get_main_queue(), ^(void){
                               imageBlock(image);
                       });
                   });
}




-(void)loadImgCache:(void (^)(Poop *, UIImage*))block{
    
    NSURL *localURL = self.localFile;
    
    UIImageFromURLToLocalFile([NSURL URLWithString:self.url], localURL, ^(UIImage*image)
                   {
                       block(self, image);
                   }
                   );
    
}

@end
