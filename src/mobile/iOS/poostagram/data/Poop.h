//
//  Poop.h
//  poostagram
//
//  Created by Vinicius Ribeiro on 20/03/13.
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>


@interface Poop : NSManagedObject

@property (nonatomic, retain) NSString * artist;
@property (nonatomic, retain) NSString * masterPiece;
@property (nonatomic, retain) NSString * pooDay;
@property (nonatomic, retain) NSString * url;
@end
