//
//  ServiceRESTpost.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 22/03/13.
//
//

#import "ServiceRESTpost.h"
@interface ServiceRESTpost()

@property (nonatomic, strong) NSURL* url;
@property (nonatomic, strong) NSString* method;
@property (nonatomic, strong) RKParams* params;

@property (nonatomic, strong) void (^onFinished)();

@end

@implementation ServiceRESTpost

@synthesize url = _url, method = _method, params = _params, onFinished = _onFinished;
RKClient* _client;

-(id)initWithURL:(NSString *)url
      postMethod:(NSString*)post
      postParams:(RKParams*)params
      onFinished:(void (^)())callBack{
    self = [super init];
    
    ServiceRESTpost* service = [[ServiceRESTpost alloc] init];
    
    service.params = params;
    service.url = [[NSURL alloc] initWithString:url];
    service.method = post;
    service.onFinished = callBack;
    
    return service;
}

-(void)post{
    
     _client = [[RKClient alloc] initWithBaseURL:self.url];
    [_client post:self.method params:self.params delegate:self];
    
}

-(void)request:(RKRequest *)request didLoadResponse:(RKResponse *)response{
    self.onFinished();
}


//## RKRequestDelegate
- (void)requestWillPrepareForSend:(RKRequest *)request{
    
}
- (void)request:(RKRequest *)request didReceiveResponse:(RKResponse *)response{
    
}
- (void)requestDidStartLoad:(RKRequest *)request{
    
}
- (void)request:(RKRequest *)request didSendBodyData:(NSInteger)bytesWritten totalBytesWritten:(NSInteger)totalBytesWritten totalBytesExpectedToWrite:(NSInteger)totalBytesExpectedToWrite{
    
}
- (void)request:(RKRequest *)request didReceiveData:(NSInteger)bytesReceived totalBytesReceived:(NSInteger)totalBytesReceived totalBytesExpectedToReceive:(NSInteger)totalBytesExpectedToReceive{
    
}
- (void)request:(RKRequest *)request didFailLoadWithError:(NSError *)error{
    
}
- (void)requestDidCancelLoad:(RKRequest *)request{
    
}
- (void)requestDidTimeout:(RKRequest *)request{
}



@end
