//
//  vcPostPoop.m
//  poostagram
//
//  Created by Vinicius Ribeiro on 08/02/13.
//  Copyright (c) 2013 poostagram. All rights reserved.
//

#import "vcPostPoop.h"
#import <MobileCoreServices/UTCoreTypes.h>
#import <RestKit/RKClient.h>
#import <UIKit/UIKit.h>
#import "ServiceRESTpost.h"

@interface vcPostPoop ()

@property (weak, nonatomic) IBOutlet UITextField *txtName;
@property (weak, nonatomic) IBOutlet UITextField *txtArtist;
@property (weak, nonatomic) IBOutlet UIImageView *imgThumbnail;
@property (weak, nonatomic) IBOutlet UIScrollView *scrollView;

@property (nonatomic) NSData* photo;


@end

@implementation vcPostPoop


#define TamanhoPermitido 700 * 1024;
UITextField* activeField;

@synthesize scrollView = _scrollView;
@synthesize photo = _photo;

- (IBAction)txtChanged:(UITextField *)sender {
}


- (IBAction)postYourPoop:(id)sender {
//    RKParams *params = [[RKParams alloc] init];
//    [params setValue:self.txtName.text   forParam:@"masterpiece"];
//    [params setValue:self.txtArtist.text forParam:@"artist"];
//    
//    NSData *imageData = UIImageJPEGRepresentation(self.imgThumbnail.image, 100);
//    NSLog(@"%d", imageData.length);
//    [params setData:imageData MIMEType:@"image/jpeg" forParam:@"poo"];
//    post = [[ServiceRESTpost alloc] initWithURL:@"http://www.poostagram.com"
//                                     postMethod:@"/upload"
//                                     postParams:params onFinished:^{
//                                         NSLog(@"foi");
//                                         post = nil;
//                                     }];

}


- (IBAction)btnPickaPoop:(id)sender {
    
    [self startMediaBrowserFromViewController: self usingDelegate: self];
}

- (BOOL) startMediaBrowserFromViewController: (UIViewController*) controller
                               usingDelegate: (id <UIImagePickerControllerDelegate,
                                               UINavigationControllerDelegate>) delegate {
    
    if (([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeSavedPhotosAlbum] == NO)
        || (delegate == nil)
        || (controller == nil))
        return NO;
    
    
    UIImagePickerController *mediaUI = [[UIImagePickerController alloc] init];
    mediaUI.sourceType = UIImagePickerControllerSourceTypeSavedPhotosAlbum;
    
    // Displays saved pictures and movies, if both are available, from the
    // Camera Roll album.
    mediaUI.mediaTypes = [UIImagePickerController availableMediaTypesForSourceType:UIImagePickerControllerSourceTypeSavedPhotosAlbum];
    
    // Hides the controls for moving & scaling pictures, or for
    // trimming movies. To instead show the controls, use YES.
    mediaUI.allowsEditing = YES;

    mediaUI.delegate = delegate;
    [controller presentViewController:mediaUI animated:YES completion:^{
        ;
    }];
    
//    [controller presentModalViewController: mediaUI animated: YES];
    return YES;
}


- (UIImage*)scaleToSize:(float)scale image:(UIImage*)from {
    
    
    CGFloat width = from.size.width * scale;
    CGFloat heigth = from.size.height * scale;
    
    CGSize size;
    
    size.height = heigth;
    size.width = width;
    
    UIGraphicsBeginImageContext(size);
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextTranslateCTM(context, 0.0, size.height);
    CGContextScaleCTM(context, 1.0, -1.0);
    
    CGContextDrawImage(context, CGRectMake(0.0f, 0.0f, size.width, size.height), from.CGImage);
    
    UIImage* scaledImage = UIGraphicsGetImageFromCurrentImageContext();
    
    UIGraphicsEndImageContext();
    
    return scaledImage;
}


- (void) imagePickerController: (UIImagePickerController *) picker
 didFinishPickingMediaWithInfo: (NSDictionary *) info {
    

    NSString *mediaType = [info objectForKey: UIImagePickerControllerMediaType];
    UIImage *originalImage, *editedImage, *imageToUse;
    
    if (CFStringCompare ((CFStringRef) mediaType, kUTTypeImage, 0) == kCFCompareEqualTo) {
        
        editedImage   = (UIImage *) [info objectForKey : UIImagePickerControllerEditedImage];
        originalImage = (UIImage *) [info objectForKey:UIImagePickerControllerOriginalImage];

        if (editedImage) {
            imageToUse = editedImage;
        } else {
            imageToUse = originalImage;
        }

        
        
        NSInteger bytes = UIImageJPEGRepresentation(imageToUse, 100).length;
        
        float diff = bytes - TamanhoPermitido;
        if (diff > 0)
        {
            float scale = 1.0 - (float)( diff / bytes );
            imageToUse = [self scaleToSize:scale image:imageToUse];
        }
        
        [self.imgThumbnail setImage:imageToUse];
        
    }

    
    [picker  dismissViewControllerAnimated:YES completion:^{
        ;
    }];
}



- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self registerForKeyboardNotifications];
    
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)registerForKeyboardNotifications
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWasShown:)
                                                 name:UIKeyboardDidShowNotification object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillBeHidden:)
                                                 name:UIKeyboardWillHideNotification object:nil];
    
}


- (void)keyboardWasShown:(NSNotification*)aNotification {
    NSDictionary* info = [aNotification userInfo];
    CGSize kbSize = [[info objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    
    UIEdgeInsets contentInsets = UIEdgeInsetsMake(0.0, 0.0, kbSize.height, 0.0);
    self.scrollView.contentInset = contentInsets;
    self.scrollView.scrollIndicatorInsets = contentInsets;
    
    // If active text field is hidden by keyboard, scroll it so it's visible
    // Your application might not need or want this behavior.
    CGRect aRect = self.view.frame;
    aRect.size.height -= kbSize.height;
    if (!CGRectContainsPoint(aRect, activeField.frame.origin) ) {
        CGPoint scrollPoint = CGPointMake(0.0, activeField.frame.origin.y-kbSize.height);
        [    self.scrollView setContentOffset:scrollPoint animated:YES];
    }}

/*
// Called when the UIKeyboardDidShowNotification is sent.
- (void)keyboardWasShown:(NSNotification*)aNotification
{
    NSDictionary* info = [aNotification userInfo];
    CGSize kbSize = [[info objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    
    UIEdgeInsets contentInsets = UIEdgeInsetsMake(0.0, 0.0, kbSize.height, 0.0);
    self.scrollView.contentInset = contentInsets;
    self.scrollView.scrollIndicatorInsets = contentInsets;
    
    // If active text field is hidden by keyboard, scroll it so it's visible
    // Your application might not need or want this behavior.
    CGRect aRect = self.view.frame;
    aRect.size.height -= kbSize.height;
    if (!CGRectContainsPoint(aRect, activeField.frame.origin) ) {
        CGPoint scrollPoint = CGPointMake(0.0, activeField.frame.origin.y-kbSize.height);
        [self.scrollView setContentOffset:scrollPoint animated:YES];
    }
}
*/

- (IBAction)txtFieldDidBeginEditing:(id)sender {
    [self textFieldDidBeginEditing:sender];
}

- (IBAction)txtFieldDidEndEditing:(id)sender {
    [self textFieldDidEndEditing:sender];
}


- (void)textFieldDidBeginEditing:(UITextField *)textField
{
    activeField = textField;
}

- (void)textFieldDidEndEditing:(UITextField *)textField
{
    activeField = nil;
}
// Called when the UIKeyboardWillHideNotification is sent
- (void)keyboardWillBeHidden:(NSNotification*)aNotification
{
    UIEdgeInsets contentInsets = UIEdgeInsetsZero;
    self.scrollView.contentInset = contentInsets;
    self.scrollView.scrollIndicatorInsets = contentInsets;
}

@end
