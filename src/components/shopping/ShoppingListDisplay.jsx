import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShoppingListDisplay({ 
  shoppingList, 
  checkedItems, 
  onItemCheck, 
  selectedMeals 
}) {
  const checkedCount = checkedItems.size;
  const totalCount = shoppingList.length;
  const completionPercentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  if (selectedMeals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl">
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No Items Yet</h3>
            <p className="text-white/70">Select meals to generate your shopping list</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping List
            </div>
            {totalCount > 0 && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 border">
                {checkedCount}/{totalCount} ({completionPercentage}%)
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[600px] overflow-y-auto print:max-h-none print:overflow-visible">
          <AnimatePresence>
            {shoppingList.length > 0 ? (
              <>
                {/* Summary */}
                <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 print:border-gray-300 print:bg-gray-50">
                  <h4 className="text-white font-semibold mb-2 print:text-black">
                    Shopping for {selectedMeals.length} meal{selectedMeals.length !== 1 ? 's' : ''}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeals.map((meal, index) => (
                      <Badge key={`${meal.id}-${index}`} className="bg-blue-500/20 text-blue-300 border-blue-500/30 border text-xs print:bg-gray-100 print:text-gray-800 print:border-gray-300">
                        {meal.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Shopping Items */}
                {shoppingList.map((item, index) => {
                  const isChecked = checkedItems.has(item.name);
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer print:border-gray-200 print:bg-white ${
                        isChecked 
                          ? 'bg-green-500/20 border-green-400/50 backdrop-blur-sm' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => onItemCheck(item.name)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isChecked}
                          className="border-white/30 mt-1 print:border-gray-400"
                        />
                        <div className="flex-1">
                          <div className={`font-medium transition-all duration-300 print:text-black ${
                            isChecked 
                              ? 'text-white/60 line-through' 
                              : 'text-white'
                          }`}>
                            {item.name}
                          </div>
                          <div className={`text-sm transition-all duration-300 print:text-gray-600 ${
                            isChecked 
                              ? 'text-white/40' 
                              : 'text-white/70'
                          }`}>
                            {item.combinedAmount}
                          </div>
                          {item.meals.length > 1 && (
                            <div className="mt-2">
                              <div className="text-white/60 text-xs mb-1 print:text-gray-500">
                                Used in:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {item.meals.map((mealName, i) => (
                                  <Badge key={i} className="bg-purple-500/20 text-purple-300 border-purple-500/30 border text-xs print:bg-gray-100 print:text-gray-700 print:border-gray-300">
                                    {mealName}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {isChecked && (
                          <Check className="w-5 h-5 text-green-400 print:text-green-600" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <Package className="w-12 h-12 text-white/50 mx-auto mb-3" />
                <p className="text-white/70">Your shopping list will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}