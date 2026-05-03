sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, JSONModel) {
    "use strict";

    return Controller.extend("com.zshopfloor.shopfloor.controller.PlannedYear", {
        onFetchYearData: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var sYear = oView.byId("yearInputYTD").getValue();

            var aFilters = [new Filter("Zyear", FilterOperator.EQ, sYear)];

            oView.setBusy(true);

            // Matching metadata EntitySet: ZET_SF_PLANYR_ODSet
            oModel.read("/ZET_SF_PLANYR_ODSet", {
                filters: aFilters,
                success: function (oData) {
                    oView.setBusy(false);
                    oView.setModel(new JSONModel(oData.results), "plannedYearModel");
                },
                error: function () {
                    oView.setBusy(false);
                }
            });
        }
    });
});