//
//  ServiceRESTpost.h
//  poostagram
//
//  Created by Vinicius Ribeiro on 22/03/13.
//
//

#import <Foundation/Foundation.h>
#import <RestKit/RestKit.h>

@interface ServiceRESTpost : NSObject <RKRequestDelegate>

-(id)initWithURL:(NSString *)url
      postMethod:(NSString*)post
      postParams:(RKParams*)params
      onFinished:(void (^)())callBack;

-(void)post;

@end
