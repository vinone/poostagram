//
//  poostagramService.h
//  poostagram
//
//  Created by Vinicius Ribeiro on 20/03/13.
//
//

#import <Foundation/Foundation.h>
#import "ResponseNewPoops.h"
#import "ServiceRESTget.h"
@interface poostagramService : NSObject

-(void)getNewPoops:(NSManagedObjectContext*)managedObjectContext
        onFinished:(void(^)(ResponseNewPoops* loaded))callBack;

-(void)postPoop: (NSData*)image
       poopName:(NSString*)masterPiece
          owner:(NSString*)artist
     onFinished:(void(^)())callBack;
@end
