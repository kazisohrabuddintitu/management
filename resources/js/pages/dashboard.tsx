import { Head, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { destroy, store, update } from '@/actions/App/Http/Controllers/UserProfileController';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';

type Profile = {
    id: number;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    bio: string | null;
};

type User = {
    id: number;
    name: string;
    email: string;
    profile: Profile | null;
};

type FormFields = {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    bio: string;
};

const emptyForm: FormFields = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    bio: '',
};

export default function Dashboard() {
    const { users, flash } = usePage().props as unknown as { users: User[]; flash: { success?: string } };
    const [createOpen, setCreateOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const createForm = useForm<FormFields>(emptyForm);
    const editForm = useForm<FormFields>(emptyForm);
    const deleteForm = useForm({});

    function openEdit(user: User) {
        editForm.setData({
            name: user.name,
            email: user.email,
            phone: user.profile?.phone ?? '',
            address: user.profile?.address ?? '',
            city: user.profile?.city ?? '',
            country: user.profile?.country ?? '',
            bio: user.profile?.bio ?? '',
        });
        setEditUser(user);
    }

    function submitCreate(e: { preventDefault(): void }) {
        e.preventDefault();
        createForm.post(store.url(), {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function submitEdit(e: { preventDefault(): void }) {
        e.preventDefault();

        if (!editUser) {
            return;
        }

        editForm.put(update.url({ user: editUser.id }), {
            onSuccess: () => setEditUser(null),
        });
    }

    function handleDelete(user: User) {
        if (!confirm(`Delete ${user.name}? This cannot be undone.`)) {
            return;
        }

        deleteForm.delete(destroy.url({ user: user.id }));
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {flash.success && (
                    <Alert variant="success">
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">User Profiles</h1>
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                <div className="rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Phone</th>
                                <th className="px-4 py-3 text-left font-medium">City</th>
                                <th className="px-4 py-3 text-left font-medium">Country</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No users yet. Click "Add User" to create one.
                                    </td>
                                </tr>
                            )}
                            {users.map((user) => (
                                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{user.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3">{user.profile?.phone ?? '—'}</td>
                                    <td className="px-4 py-3">{user.profile?.city ?? '—'}</td>
                                    <td className="px-4 py-3">{user.profile?.country ?? '—'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="ghost" size="sm" onClick={() => openEdit(user)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(user)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="grid gap-4">
                        <ProfileFormFields form={createForm} />
                        <Button type="submit" disabled={createForm.processing}>
                            Create
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="grid gap-4">
                        <ProfileFormFields form={editForm} />
                        <Button type="submit" disabled={editForm.processing}>
                            Save changes
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function ProfileFormFields({ form }: { form: ReturnType<typeof useForm<FormFields>> }) {
    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                />
                {form.errors.email && <p className="text-sm text-destructive">{form.errors.email}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    value={form.data.address}
                    onChange={(e) => form.setData('address', e.target.value)}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={form.data.city} onChange={(e) => form.setData('city', e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                        id="country"
                        value={form.data.country}
                        onChange={(e) => form.setData('country', e.target.value)}
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                    id="bio"
                    rows={3}
                    value={form.data.bio}
                    onChange={(e) => form.setData('bio', e.target.value)}
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
