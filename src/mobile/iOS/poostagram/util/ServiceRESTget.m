//
//  ServiceCaller.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 20/03/13.
//
//

#import "ServiceRESTget.h"
#import "ResponseService.h"

@interface ServiceRESTget()

@property (nonatomic, strong) NSURL* url;
@property (nonatomic, strong) NSString* method;
@property (nonatomic, strong) ResponseService* response;

@property (nonatomic, strong) void (^onFinished)(ResponseService* response);

@end

@implementation ServiceRESTget

@synthesize url = _url, method = _method, response = _response, onFinished = _onFinished;

-(id)initWithURL:(NSString *)url
         getMethod:(NSString*)get
        onFinished:(void (^)(ResponseService *))callBack

{
    self = [super init];
    
    ServiceRESTget* service = [[ServiceRESTget alloc] init];
    
    service.response = [[ResponseService alloc] init];
    service.url = [[NSURL alloc] initWithString:url];
    service.method = get;
    service.onFinished = callBack;
    
    return service;
}

-(void)get{
    
    RKClient* client = [[RKClient alloc] initWithBaseURL:self.url];
    self.response.calledAt = [NSDate date];
    [client get:self.method delegate:self];
}

-(void)request:(RKRequest *)request didLoadResponse:(RKResponse *)response{
    
    self.response.returnedAt = [NSDate date];
    NSError* error;
    self.response.response = (NSArray*)[response parsedBody:&error];
    self.onFinished(self.response);
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
