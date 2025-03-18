import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LockIcon } from 'lucide-react';
import { useState } from 'react';

interface SchemaPasswordDialogProps {
  onCorrectPassword: () => void;
}

export const SchemaPasswordDialog = ({
  onCorrectPassword,
}: SchemaPasswordDialogProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '743893') {
      sessionStorage.setItem('schema-authenticated', 'true');
      onCorrectPassword();
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="space-y-3 mb-6">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="bg-primary/10 p-2 rounded-full">
              <LockIcon className="h-6 w-6 text-primary" />
            </div>
            Schema Explorer Toegang
          </DialogTitle>
          <DialogDescription>
            Voer het wachtwoord in om toegang te krijgen tot de Schema Explorer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Voer wachtwoord in"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`h-11 px-3 ${error ? 'border-red-500' : ''}`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <LockIcon className="h-4 w-4" />
                Incorrect wachtwoord
              </p>
            )}
          </div>
          <Button type="submit" className="w-full h-11 text-base">
            Toegang verkrijgen
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
