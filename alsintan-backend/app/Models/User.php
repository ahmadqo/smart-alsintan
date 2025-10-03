<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'nama',
        'email',
        'password',
        'role',
        'last_login_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function pengajuanAlsintan()
    {
        return $this->hasMany(Pengajuan::class, 'created_by');
    }

    public function distribusiAlsintan()
    {
        return $this->hasMany(DistribusiAlsintan::class, 'distributed_by');
    }

    // Scopes
    public function scopeAdmin($query)
    {
        return $query->where('role', 'admin');
    }

    public function scopeStaff($query)
    {
        return $query->where('role', 'staff');
    }

    // Accessors
    public function getIsAdminAttribute()
    {
        return $this->role === 'admin';
    }

    public function getRoleBadgeAttribute()
    {
        $badges = [
            'admin' => ['class' => 'success', 'text' => 'Administrator'],
            'staff' => ['class' => 'info', 'text' => 'Staff']
        ];

        return $badges[$this->role] ?? ['class' => 'secondary', 'text' => 'Unknown'];
    }
}
