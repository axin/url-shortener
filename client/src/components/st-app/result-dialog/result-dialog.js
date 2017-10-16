export class ResultDialogController {
    constructor($mdDialog, shortUrl) {
        this.$mdDialog = $mdDialog;
        this.shortUrl = shortUrl;
    }

    closeDialog() {
        this.$mdDialog.hide();
    }
}
