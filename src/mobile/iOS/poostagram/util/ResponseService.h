//
//  ResponseService.h
//  poostagram
//
//  Created by Vinicius Ribeiro on 20/03/13.
//
//

#import <Foundation/Foundation.h>

@interface ResponseService : NSObject

@property (nonatomic, strong) NSDate* calledAt;
@property (nonatomic, strong) NSDate* returnedAt;
@property (nonatomic, strong) NSString* url;
@property (nonatomic, strong) id response;

@end
