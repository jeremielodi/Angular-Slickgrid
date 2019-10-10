import { AngularGridInstance, AngularUtilService } from 'angular-slickgrid';
interface DropDownServiceParams {
  angularUtilService: AngularUtilService,
  angularGrid: AngularGridInstance,
  CustomActionFormatter: any, // the custom action component that contains the dropdown
  args: any, // help to get the data context
  actionColumnIndex: number,
  $: any,
  parent : any
}

export class DropDownService {

  static init(Params: DropDownServiceParams) {
    const { angularUtilService, angularGrid, CustomActionFormatter, args, actionColumnIndex, $ , parent} = Params;

    const c = new CustomActionFormatter();

    const dropdownId = c.dropDownId || 'dropDownId';
    const dropdownMenuId = c.dropDownMenuId || 'dropDownMenuId';
    /*   
    if($('#' + dropdownId).is(":visible")){
      $('#' + dropdownId).remove();
      return;
    }*/
    if (args.cell !== actionColumnIndex) {
      return; // don't do anything unless it's the Action column which is at position 6 in this grid
    }

    const cell = args.cell;
    const row = args.row;

    // hide the dropdown we created as a Formatter, we'll redisplay it later
    const formatterElm = $(`#myDrop-r${row}-c${cell}`);
    const cellPos = formatterElm.offset();

    
    const componentOutput = angularUtilService.createAngularComponent(CustomActionFormatter);

    // pass "this" and the row number to the Component instance (CustomActionFormatter) so that we can call "parent.deleteCell(row)" with (click)
    const metadata = angularGrid.gridService.getColumnFromEventArguments(args);
    Object.assign(componentOutput.componentRef.instance, { parent, row: args.row, dataContext: metadata.dataContext });


    // use a delay to make sure Angular ran at least a full cycle and make sure it finished rendering the Component before using it
    setTimeout(() => {
      const elm = $(componentOutput.domElement);
      elm.appendTo('body');
      elm.css('position', 'absolute');
      elm.css('top', cellPos.top + 30);
      elm.css('left', cellPos.left);
      $('#' + dropdownId).dropdown('show');

      // check if it should drop up or drop down
      var offset = 35;
      const iElement = $('.dropdown-menu');
      const iElementWrapper = iElement.parent();
      const iElementWrapperOffsetTop = iElementWrapper.offset().top;
      const iElementHeight = iElement.height();
      const windowHeight = $(window).height();
      const shouldDropUp = (windowHeight - iElementHeight - offset) < iElementWrapperOffsetTop;
      const menuMarginTop = shouldDropUp ? '-'.concat(`${iElementHeight + 40}`, 'px') : '0px';
      elm.css({ 'margin-top': menuMarginTop });

      // set dropdown margin left according to the document width
      const parentOfset = iElementWrapper.offset().left;
      const leftMargin = parentOfset - $(document).width();;

      elm.css({'margin-left': (elm.width() + leftMargin) + 'px' });

      // hide dropdown menu after a click on it child
      iElement.children().click(() => {
        setTimeout(() => {
          $('#' + dropdownId).remove();
        }, 10);
      })

      // avoid duplication of actions
      $('#' + dropdownMenuId).css('display', 'none');

      $('#' + dropdownId).on('hidden.bs.dropdown', () => {
        formatterElm.show();
      });
      
      // hide dropdown menu on grid scroll
      $(".slick-viewport").on( 'scroll', function(){
        $('#' + dropdownId).remove();
     });

      $(window).click(() => {
        $('#' + dropdownId).remove();
      });
    })
  }
}
