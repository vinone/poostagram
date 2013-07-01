//
//  Poop+Poop_ImageCache.h
//  poostagram
//
//  Created by Vinicius Ribeiro on 20/03/13.
//
//

#import "Poop.h"

@interface Poop (Poop_ImageCache)

-(NSURL*)localFile;
-(void)loadImgCache:(void (^)(Poop *, UIImage*))block;

@end
