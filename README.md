
The latest version can be included in your player from this location: -


```
https://master-boomi-flow-assets-prod-us-east-1.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/fdc.js,
https://master-boomi-flow-assets-prod-us-east-1.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/fdc.css
```

A running demo can be seen here: -

Coming Soon


A sharing token of that example flow is: -

Coming Soon


NOTE: Visibility based on page conditions is respected.



# ColorPicker
![Component Image](https://github.com/MarkWattsBoomi/SiteDesigner/blob/main/comp.png)
![Picker Image](https://github.com/MarkWattsBoomi/SiteDesigner/blob/main/modal.png)

## Functionality

Provides a graphical color picker component which outputs hex color code into a string state value.

Initially the current color value is displayed with the hex color code written over the top.

Clicking the component will pop up a modal dialog with the color picker in it.


## Component Configuration

### State

A string field.

### width & height
If specified set the size of the component on the page in pixels

## Outcomes

### OnSelect
If an outcome named specifically "OnSelect" is attached to the component it will be trigered when the user selects a new value.



# ImageAssetPicker
![Component Image](https://github.com/MarkWattsBoomi/SiteDesigner/blob/main/imgpicker.png)
![Component Image](https://github.com/MarkWattsBoomi/SiteDesigner/blob/main/imgpickermodal.png)

## Functionality

Provides a graphical image picker component to select image type files from the current tenant's assets folder.

Initially the current image is displayed.

Clicking the component will pop up a modal dialog with the asset picker in it.

## Component Configuration

### State

A string field to receive the asset's public url.

### width & height
If specified set the size of the component on the page in pixels and the size of the image tiles in the picker.

### attributes

#### user
The email of a user with access to the tenant's design time.

#### token
A valid flow api token for that user.

## Outcomes

### OnSelect
If an outcome named specifically "OnSelect" is attached to the component it will be trigered when the user selects a new value.


# FlowPicker
![Component Image](https://github.com/MarkWattsBoomi/SiteDesigner/blob/main/flowpicker.png)

## Functionality

Provides a combobox with a list of the flows in the current tenant.

## Component Configuration

### State

A string field to receive the id of the selected flow.

### attributes

#### user
The email of a user with access to the tenant's design time.

#### token
A valid flow api token for that user.

## Outcomes

### OnSelect
If an outcome named specifically "OnSelect" is attached to the component it will be trigered when the user selects a new value.
