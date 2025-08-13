import React, { useState, useEffect } from "react";
import { FamilyMember, FamilyPreferences } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Edit, Trash2, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import FamilyMemberCard from "../components/family/FamilyMemberCard";
import AddMemberDialog from "../components/family/AddMemberDialog";
import EditMemberDialog from "../components/family/EditMemberDialog";
import FamilyPreferencesCard from "../components/family/FamilyPreferencesCard";

export default function Family() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyPreferences, setFamilyPreferences] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    setIsLoading(true);
    try {
      const members = await FamilyMember.list();
      setFamilyMembers(members);
      
      const prefsList = await FamilyPreferences.list();
      if (prefsList.length > 0) {
        setFamilyPreferences(prefsList[0]);
      } else {
        // Create initial preferences if none exist
        const newPrefs = await FamilyPreferences.create({ preferred_cuisines: [], cooking_apparatus: [] });
        setFamilyPreferences(newPrefs);
      }
    } catch (error) {
      console.error("Error loading family data:", error);
    }
    setIsLoading(false);
  };

  const handleAddMember = async (memberData) => {
    try {
      await FamilyMember.create(memberData);
      setShowAddDialog(false);
      loadFamilyData();
    } catch (error) {
      console.error("Error adding family member:", error);
    }
  };

  const handleEditMember = async (memberData) => {
    try {
      await FamilyMember.update(editingMember.id, memberData);
      setEditingMember(null);
      loadFamilyData();
    } catch (error) {
      console.error("Error updating family member:", error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this family member?")) {
      try {
        await FamilyMember.delete(memberId);
        loadFamilyData();
      } catch (error) {
        console.error("Error deleting family member:", error);
      }
    }
  };
  
  const handleSavePreferences = async (prefsData) => {
    try {
      if (familyPreferences && familyPreferences.id) {
        const updatedPrefs = await FamilyPreferences.update(familyPreferences.id, prefsData);
        setFamilyPreferences(updatedPrefs);
      }
    } catch (error) {
      console.error("Error saving family preferences:", error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2 flex items-center gap-3"
            >
              <Users className="w-8 h-8" />
              Your Family
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-lg"
            >
              Manage individual profiles and family-wide preferences
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Member
            </Button>
          </motion.div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4 ml-2">Family Members</h2>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {Array(2).fill(0).map((_, i) => (
                    <Card key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl animate-pulse">
                      <CardContent className="p-6 h-48"></CardContent>
                    </Card>
                  ))}
                </motion.div>
              ) : familyMembers.length > 0 ? (
                <motion.div
                  key="members"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {familyMembers.map((member, index) => (
                    <FamilyMemberCard
                      key={member.id}
                      member={member}
                      index={index}
                      onEdit={() => setEditingMember(member)}
                      onDelete={() => handleDeleteMember(member.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-md mx-auto">
                    <CardContent className="p-12">
                      <Users className="w-16 h-16 text-white/50 mx-auto mb-4" />
                      <h3 className="text-white text-xl font-semibold mb-2">No Family Members Yet</h3>
                      <p className="text-white/70 mb-6">Add your first family member to start personalizing meal suggestions</p>
                      <Button
                        onClick={() => setShowAddDialog(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add First Member
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
        
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-white mb-4 ml-2">Family Preferences</h2>
            <FamilyPreferencesCard 
              preferences={familyPreferences}
              onSave={handleSavePreferences}
            />
        </div>
      </div>

      {/* Dialogs */}
      <AddMemberDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSave={handleAddMember}
      />

      <EditMemberDialog
        open={!!editingMember}
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleEditMember}
      />
    </div>
  );
}
