//
//  vctPoop.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 16/03/13.
//
//

#import "vctPoop.h"
#import "Poop.h"
#import "CellTest.h"
#import "poostagramService.h"

@interface vctPoop ()

@property (nonatomic, strong) NSArray* items;
@property (nonatomic, strong) poostagramService* service;

@end

@implementation vctPoop

@synthesize ManagedObjectContext = _ManagedObjectContext;

-(void)setManagedObjectContext:(NSManagedObjectContext *)ManagedObjectContext{
    _ManagedObjectContext = ManagedObjectContext;
    [self setupFetchedResultsController];

    if (self.service) return;
    
    self.service = [[poostagramService alloc] init];

    [self.service getNewPoops:ManagedObjectContext onFinished:^(ResponseNewPoops *loaded) {
        NSLog(@"%d", loaded.poops.count);
        self.service = nil;
    }];
}


- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        // Custom initialization
    }
    return self;
}

-(void)btnAddClick:(UIBarButtonItem*)sender{
    [self performSegueWithIdentifier: @"postPoop" sender: self];

}


-(void)adjustNavegationBar{
    
    if (self.navigationItem.rightBarButtonItem)
        return;

    [self.navigationController.navigationBar
     setBackgroundImage:[UIImage imageNamed:@"bat-top.png"]
     forBarMetrics:UIBarMetricsDefault];
    
    UIButton *addView = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 34, 30)];
    [addView addTarget:self.view action:@selector(addPoop) forControlEvents:UIControlEventTouchUpInside];
    [addView setBackgroundImage:[UIImage imageNamed:@"add.png"] forState:UIControlStateNormal];
    
    UIBarButtonItem *addButton = [[UIBarButtonItem alloc] initWithCustomView:addView];
    [self.navigationItem setRightBarButtonItem:addButton];
    [self.navigationController setTitle:@""];
    
}
-(void)viewWillAppear:(BOOL)animated{
    [self adjustNavegationBar];
}


- (void)viewDidLoad
{
    [super viewDidLoad];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)setupFetchedResultsController
{
    
    NSFetchRequest *request = [NSFetchRequest fetchRequestWithEntityName:[[Poop class] description]];
    
    request.sortDescriptors = [NSArray arrayWithObject:[NSSortDescriptor
                                                        sortDescriptorWithKey:@"pooDay"
                                                        ascending:NO
                                                        selector:@selector(compare:)]];

    self.fetchedResultsController = [[NSFetchedResultsController alloc]
                                     initWithFetchRequest:request
                                     managedObjectContext:self.ManagedObjectContext
                                     sectionNameKeyPath:nil
                                     cacheName:nil];
}


-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return tableView.bounds.size.height -
    self.navigationController.navigationBar.frame.size.height;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"Cell";
    
    // Configure the cell...
    Poop *item = [self.fetchedResultsController objectAtIndexPath:indexPath];
    
    CellTest *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    [cell setPoop:item];
    return cell;
    
}

@end
