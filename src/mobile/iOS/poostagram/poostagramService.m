//
//  poostagramService.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 20/03/13.
//
//

#import "poostagramService.h"
#import <RestKit/RestKit.h>
#import <RestKit/JSONKit.h>
#import "Poop.h"
#import "ResponseNewPoops.h"
#import "ServiceRESTget.h"
#import "ServiceRESTpost.h"

@interface poostagramService()

@property (nonatomic, strong) ServiceRESTget* call;
@property (nonatomic, strong) ServiceRESTpost* post;
@property (nonatomic, strong) NSMutableDictionary* calleds;
@end

@implementation poostagramService
@synthesize call = _call;
@synthesize calleds = _calleds;

static NSString* __services = @"http://www.poostagram.com/";
static NSNumber* key = nil;

-(void)postPoop: (NSData*)image
       poopName:(NSString*)masterPiece
          owner:(NSString*)artist
     onFinished:(void(^)())callBack
{
    RKParams *params = [[RKParams alloc] init];
    [params setValue:masterPiece   forParam:@"masterpiece"];
    [params setValue:artist forParam:@"artist"];
    
    [params setData:image MIMEType:@"image/jpeg" forParam:@"poo"];
    if (key == nil) key = [[NSNumber alloc] initWithInt:1];

    NSNumber* chave = [[NSNumber alloc] initWithInt:[key intValue]];
    
    ServiceRESTpost* post = [[ServiceRESTpost alloc] initWithURL:@"http://www.poostagram.com"
                                     postMethod:@"/upload"
                                     postParams:params onFinished:^{
                                         [self.calleds removeObjectForKey:chave];
                                         
                                     }];
    
    [self.calleds setObject:post forKey:chave];

    
    
}

-(void)getNewPoops:(NSManagedObjectContext*)managedObjectContext
        onFinished:(void(^)(ResponseNewPoops* loaded))callBack{
    
    if (self.call) return;
    
    self.call = [[ServiceRESTget alloc] initWithURL:__services getMethod:@"list" onFinished:^(ResponseService * pResponse)
                            {
                                
                                NSArray* poops = (NSArray*)[pResponse response];
                                NSMutableArray* list = [[NSMutableArray alloc] init];
                                
                                NSFetchRequest *request = [NSFetchRequest fetchRequestWithEntityName:[[Poop class] description]];
                                request.sortDescriptors = [NSArray arrayWithObject:[NSSortDescriptor
                                                                                    sortDescriptorWithKey:@"url"
                                                                                    ascending:NO
                                                                                    selector:@selector(compare:)]];
                                
                                for (NSDictionary* poop in poops) {
                                    
                                    NSString* url = [poop valueForKey:@"url"];
                                    

                                    [request setPredicate:[NSPredicate predicateWithFormat:@"url = %@", url]];
                                    
                                    NSFetchedResultsController *x1 = [[NSFetchedResultsController alloc]
                                                                      initWithFetchRequest:request
                                                                      managedObjectContext:managedObjectContext
                                                                      sectionNameKeyPath:nil
                                                                      cacheName:nil];
                                    NSError *error;
                                    
                                    [x1 performFetch:&error];
                                    if (error)
                                        NSLog(@"[%@ %@] %@ (%@)", NSStringFromClass([self class]), NSStringFromSelector(_cmd), [error localizedDescription], [error localizedFailureReason]);

                                    if ([x1 fetchedObjects].count > 0)
                                        continue;
                                    
                                    Poop* newPoop = [NSEntityDescription insertNewObjectForEntityForName:[[Poop class] description]
                                                                                  inManagedObjectContext:managedObjectContext];

                                    NSDate* date =  [poop valueForKey:@"pooDay"];

                                    [list addObject:newPoop];
                                    
                                    for (NSString* item in poop.allKeys)
                                    {
                                        
                                        NSString *newItem = [NSString stringWithFormat:@"set%@%@:",
                                                             [[item substringToIndex:1] uppercaseString],
                                                             [item substringFromIndex:1]];
                                        
                                        SEL selector = NSSelectorFromString(newItem);
                                        
                                        if ([newPoop respondsToSelector:selector])
                                            [newPoop performSelector:selector withObject:[poop objectForKey:item]];
                                    }
                                }
                                
                                ResponseNewPoops* result = [[ResponseNewPoops alloc] init];
                                result.poops = poops;
                                
                                callBack(result);
                                [managedObjectContext save:NULL];
                            }];
    
    [self.call get];
    
}


@end
