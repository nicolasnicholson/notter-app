"use client";

import { useStore } from "@/lib/store";
import { Button } from "./ui/button";
import { Archive, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export function NoteFilters() {
  const { filter, setFilter } = useStore();
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        size="sm"
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => setFilter("all")}
        className="text-xs sm:text-sm"
      >
        {t('filter.all')}
      </Button>
      <Button
        size="sm"
        variant={filter === "favorites" ? "default" : "outline"}
        onClick={() => setFilter("favorites")}
        className="text-xs sm:text-sm"
      >
        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        {t('filter.favorites')}
      </Button>
      <Button
        size="sm"
        variant={filter === "archived" ? "default" : "outline"}
        onClick={() => setFilter("archived")}
        className="text-xs sm:text-sm"
      >
        <Archive className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        {t('filter.archived')}
      </Button>
    </div>
  );
}