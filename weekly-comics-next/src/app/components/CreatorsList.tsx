"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/app/components/animations/sharedAnimations";
import InfoRow from "@/app/components/InfoRow";

interface Creator {
  name: string;
  roles: string[];
}

interface CreatorsListProps {
  creators: Creator[];
}

export default function CreatorsList({ creators }: CreatorsListProps) {
  if (!creators || creators.length === 0) return null;

  const roleGroups: { [role: string]: string[] } = {};

  creators.forEach((creator) => {
    creator.roles.forEach((role) => {
      if (!roleGroups[role]) {
        roleGroups[role] = [];
      }
      roleGroups[role].push(creator.name);
    });
  });

  return (
    <motion.section {...fadeUp(0.4)} className="mt-4">
      <h3 className="text-xl font-bold text-teal-700 mb-2">Creators</h3>
      <dl className="grid gap-1 grid-cols-[max-content]">
        {Object.entries(roleGroups).map(([role, names]) => (
          <InfoRow
            key={role}
            label={role}
            value={names.filter((name, index, self) => self.indexOf(name) === index).join(", ")}
          />
        ))}
      </dl>
    </motion.section>
  );
}
