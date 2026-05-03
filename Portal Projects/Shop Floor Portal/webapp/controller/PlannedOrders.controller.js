sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.zshopfloor.shopfloor.controller.PlannedOrders", {

        onFetch: function () {
            var oView = this.getView();
            var oModel = oView.getModel();

            // 1. Get Month from Dropdown and Year from Input
            var sMonth = oView.byId("monthSelect").getSelectedKey();
            var sYear = oView.byId("yearInput").getValue();

            // 2. Validation: Make sure year is not empty
            if (!sYear) {
                MessageToast.show("Please enter a year (e.g., 2025)");
                return;
            }

            // 3. Create Filters (Names must match Metadata exactly)
            var aFilters = [
                new Filter("Zmonth", FilterOperator.EQ, sMonth),
                new Filter("Zyear", FilterOperator.EQ, sYear)
            ];

            oView.setBusy(true);

            // 4. Call SAP OData Service
            oModel.read("/ZET_SF_PLAN_ODSet", {
                filters: aFilters,
                success: function (oData) {
                    oView.setBusy(false);
                    
                    // results will be an empty array [] if no data is found in SAP
                    // Your table's noDataText="No orders found" will handle the empty case
                    var oResultModel = new JSONModel(oData.results);
                    oView.setModel(oResultModel, "plannedOrdersModel");

                    if (oData.results.length === 0) {
                        MessageToast.show("No data found for the selected period.");
                    } else {
                        MessageToast.show("Found " + oData.results.length + " orders.");
                    }
                },
                error: function (oError) {
                    oView.setBusy(false);
                    MessageToast.show("Error fetching data from backend.");
                    console.error(oError);
                }
            });
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("dashboard");
        }
    });
});