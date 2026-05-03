sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.zshopfloor.shopfloor.controller.ProductionOrders", {
        onFetch: function () {
            var oView = this.getView();
            var sMonth = oView.byId("prodMonthSelect").getSelectedKey();
            var sYear = oView.byId("prodYearInput").getValue();

            if (!sYear) {
                MessageToast.show("Please enter a year.");
                return;
            }

            var aFilters = [
                new Filter("Zmonth", FilterOperator.EQ, sMonth),
                new Filter("Zyear", FilterOperator.EQ, sYear)
            ];

            oView.setBusy(true);
            oView.getModel().read("/ZET_SF_PROD_ODSet", {
                filters: aFilters,
                success: function (oData) {
                    oView.setBusy(false);
                    oView.setModel(new JSONModel(oData.results), "productionOrdersModel");
                    if (oData.results.length === 0) MessageToast.show("No records found.");
                },
                error: function () {
                    oView.setBusy(false);
                    MessageToast.show("Error connecting to SAP.");
                }
            });
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("dashboard");
        }
    });
});