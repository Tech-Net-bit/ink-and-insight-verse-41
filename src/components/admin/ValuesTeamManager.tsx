
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Users, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Value {
  title: string;
  description: string;
  icon?: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
}

interface ValuesTeamManagerProps {
  values: Value[];
  teamMembers: TeamMember[];
  showDefaultValues: boolean;
  showDefaultTeam: boolean;
  onValuesChange: (values: Value[]) => void;
  onTeamChange: (team: TeamMember[]) => void;
  onShowDefaultValuesChange: (show: boolean) => void;
  onShowDefaultTeamChange: (show: boolean) => void;
}

const ValuesTeamManager = ({
  values,
  teamMembers,
  showDefaultValues,
  showDefaultTeam,
  onValuesChange,
  onTeamChange,
  onShowDefaultValuesChange,
  onShowDefaultTeamChange,
}: ValuesTeamManagerProps) => {
  const { toast } = useToast();
  const [newValue, setNewValue] = useState<Value>({ title: '', description: '', icon: '💡' });
  const [newMember, setNewMember] = useState<TeamMember>({ name: '', role: '', bio: '' });

  const addValue = () => {
    if (!newValue.title.trim() || !newValue.description.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and description for the value',
        variant: 'destructive',
      });
      return;
    }

    onValuesChange([...values, newValue]);
    setNewValue({ title: '', description: '', icon: '💡' });
    toast({
      title: 'Success',
      description: 'Value added successfully',
    });
  };

  const removeValue = (index: number) => {
    const updatedValues = values.filter((_, i) => i !== index);
    onValuesChange(updatedValues);
    toast({
      title: 'Success',
      description: 'Value removed successfully',
    });
  };

  const addTeamMember = () => {
    if (!newMember.name.trim() || !newMember.role.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both name and role for the team member',
        variant: 'destructive',
      });
      return;
    }

    onTeamChange([...teamMembers, newMember]);
    setNewMember({ name: '', role: '', bio: '' });
    toast({
      title: 'Success',
      description: 'Team member added successfully',
    });
  };

  const removeTeamMember = (index: number) => {
    const updatedTeam = teamMembers.filter((_, i) => i !== index);
    onTeamChange(updatedTeam);
    toast({
      title: 'Success',
      description: 'Team member removed successfully',
    });
  };

  return (
    <div className="space-y-6">
      {/* Values Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Company Values
          </CardTitle>
          <CardDescription>
            Customize your company values that will be displayed on the About page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-default-values"
              checked={showDefaultValues}
              onCheckedChange={onShowDefaultValuesChange}
            />
            <Label htmlFor="show-default-values">Show default values alongside custom ones</Label>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Add New Value</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value-icon">Icon (Emoji)</Label>
                <Input
                  id="value-icon"
                  value={newValue.icon}
                  onChange={(e) => setNewValue({...newValue, icon: e.target.value})}
                  placeholder="💡"
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value-title">Title</Label>
                <Input
                  id="value-title"
                  value={newValue.title}
                  onChange={(e) => setNewValue({...newValue, title: e.target.value})}
                  placeholder="Innovation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value-description">Description</Label>
                <Textarea
                  id="value-description"
                  value={newValue.description}
                  onChange={(e) => setNewValue({...newValue, description: e.target.value})}
                  placeholder="We constantly seek new ways to improve..."
                  rows={2}
                />
              </div>
            </div>
            <Button onClick={addValue} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Value
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Current Values ({values.length})</h4>
            {values.length === 0 ? (
              <p className="text-muted-foreground">No custom values added yet.</p>
            ) : (
              <div className="space-y-3">
                {values.map((value, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{value.icon}</span>
                          <h5 className="font-medium">{value.title}</h5>
                        </div>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeValue(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            Add and manage team members that will be displayed on the About page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-default-team"
              checked={showDefaultTeam}
              onCheckedChange={onShowDefaultTeamChange}
            />
            <Label htmlFor="show-default-team">Show default team members alongside custom ones</Label>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Add New Team Member</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Name</Label>
                <Input
                  id="member-name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-role">Role</Label>
                <Input
                  id="member-role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  placeholder="Chief Technology Officer"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="member-bio">Bio</Label>
                <Textarea
                  id="member-bio"
                  value={newMember.bio}
                  onChange={(e) => setNewMember({...newMember, bio: e.target.value})}
                  placeholder="Brief description about the team member..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-image">Image URL (Optional)</Label>
                <Input
                  id="member-image"
                  value={newMember.image || ''}
                  onChange={(e) => setNewMember({...newMember, image: e.target.value})}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-linkedin">LinkedIn URL (Optional)</Label>
                <Input
                  id="member-linkedin"
                  value={newMember.linkedin || ''}
                  onChange={(e) => setNewMember({...newMember, linkedin: e.target.value})}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </div>
            <Button onClick={addTeamMember} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Current Team Members ({teamMembers.length})</h4>
            {teamMembers.length === 0 ? (
              <p className="text-muted-foreground">No custom team members added yet.</p>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          {member.image && (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h5 className="font-medium">{member.name}</h5>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        {member.bio && (
                          <p className="text-sm text-muted-foreground">{member.bio}</p>
                        )}
                        {(member.linkedin || member.twitter) && (
                          <div className="flex gap-2 text-sm">
                            {member.linkedin && (
                              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                LinkedIn
                              </a>
                            )}
                            {member.twitter && (
                              <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Twitter
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTeamMember(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValuesTeamManager;
