sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.zshopfloor.shopfloor.controller.ProductionYear", {
        onFetchYearData: function () {
            var oView = this.getView();
            var sYear = oView.byId("prodYearInputYTD").getValue();

            if (!sYear) {
                MessageToast.show("Enter a year.");
                return;
            }

            var aFilters = [new Filter("Zyear", FilterOperator.EQ, sYear)];

            oView.setBusy(true);
            oView.getModel().read("/ZET_SF_PRODYR_ODSet", {
                filters: aFilters,
                success: function (oData) {
                    oView.setBusy(false);
                    oView.setModel(new JSONModel(oData.results), "productionYearModel");
                },
                error: function () {
                    oView.setBusy(false);
                    MessageToast.show("Backend Error.");
                }
            });
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("dashboard");
        }
    });
});