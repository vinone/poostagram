//
//  ServiceCaller.h
//  poostagram
//
//  Created by Vinicius Ribeiro on 20/03/13.
//
//

#import <Foundation/Foundation.h>
#import <RestKit/RestKit.h>
#import "ResponseService.h"

@interface ServiceRESTget : NSObject <RKRequestDelegate>

-(id)initWithURL:(NSString *)url
       getMethod:(NSString*)get
      onFinished:(void (^)(ResponseService *))callBack;

-(void)get;
@end
