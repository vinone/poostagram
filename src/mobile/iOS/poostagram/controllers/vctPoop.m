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

@interface vctPoop ()
@property (nonatomic, strong) NSArray* items;
@end

@implementation vctPoop

@synthesize items = _items;
@synthesize ManagedObjectContext = _ManagedObjectContext;

-(void)setManagedObjectContext:(NSManagedObjectContext *)ManagedObjectContext{
    
}

-(void)setItems:(NSArray *)items{
    _items = items;
    [self.tableView reloadData];
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

    [self.navigationController.navigationBar setBackgroundImage:[UIImage imageNamed:@"bat-top.png"]
                                                  forBarMetrics:UIBarMetricsDefault];
    
    UIButton *addView = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 34, 30)];
    [addView addTarget:self.view action:@selector(addPoop) forControlEvents:UIControlEventTouchUpInside];
    [addView setBackgroundImage:[UIImage imageNamed:@"add.png"] forState:UIControlStateNormal];
    
    UIBarButtonItem *addButton = [[UIBarButtonItem alloc] initWithCustomView:addView];
    [self.navigationItem setRightBarButtonItem:addButton];
    
    
}
-(void)viewWillAppear:(BOOL)animated{
    [self adjustNavegationBar];
    
}


- (void)viewDidLoad
{
    [super viewDidLoad];

    // Uncomment the following line to preserve selection between presentations.
    // self.clearsSelectionOnViewWillAppear = NO;
 
    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    // self.navigationItem.rightBarButtonItem = self.editButtonItem;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    // Return the number of sections.
    return 1;
}




- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.items.count;
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"Cell";
    CellTest *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    [cell setPoop:[self.items objectAtIndex:indexPath.row]];
    
    return cell;
}

@end
