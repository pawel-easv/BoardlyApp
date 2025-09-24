using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public partial class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Board> Boards { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserBoard> UserBoards { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Board>(entity =>
        {
            entity.HasKey(e => e.BoardId).HasName("boards_pkey");

            entity.ToTable("boards", "boardly");

            entity.Property(e => e.BoardId)
                .HasDefaultValueSql("nextval('boards_board_id_seq'::regclass)")
                .HasColumnName("board_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("tasks_pkey");

            entity.ToTable("tasks", "boardly");

            entity.Property(e => e.TaskId)
                .ValueGeneratedNever()
                .HasColumnName("task_id");
            entity.Property(e => e.BoardId).HasColumnName("board_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(50)
                .HasColumnName("title");

            entity.HasOne(d => d.Board).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.BoardId)
                .HasConstraintName("tasks_board_id_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("users_pkey");

            entity.ToTable("users", "boardly");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.Property(e => e.UserId)
                .HasDefaultValueSql("nextval('users_user_id_seq'::regclass)")
                .HasColumnName("user_id");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .HasColumnName("username");
        });

        modelBuilder.Entity<UserBoard>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.BoardId }).HasName("user_boards_pkey");

            entity.ToTable("user_boards", "boardly");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.BoardId).HasColumnName("board_id");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasColumnName("role");

            entity.HasOne(d => d.Board).WithMany(p => p.UserBoards)
                .HasForeignKey(d => d.BoardId)
                .HasConstraintName("user_boards_board_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.UserBoards)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("user_boards_user_id_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
